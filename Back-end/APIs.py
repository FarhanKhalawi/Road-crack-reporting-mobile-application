from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import json
import pyrebase
from werkzeug.utils import secure_filename

# Initialize Firebase
cred = credentials.Certificate('config_1.json')  # Load Firebase config
firebase_admin.initialize_app(cred)  # Initialize Firebase admin SDK
pb = pyrebase.initialize_app(json.load(open('config_2.json')))  # Initialize Pyrebase
db = firestore.client()
bucket = storage.bucket('rcd-test2.appspot.com')

app = Flask(__name__)


# ======================================================================================================================
#                                         Signup
# ======================================================================================================================
@app.route('/signUp', methods=['POST'])
def sign_up():
    """Endpoint to sign up a new user."""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    mobileNumber = data.get('mobileNumber')

    if not all([email, password, firstName, lastName, mobileNumber]):
        return jsonify({'error': 'Missing information'}), 400
    try:
        user = auth.create_user(email=email, password=password)
        userRef = db.collection('users').document(user.uid)
        userRef.set({
            'firstName': firstName,
            'lastName': lastName,
            'mobileNumber': mobileNumber,
            'email': email
        })
        return jsonify({'user_id': user.uid, 'email': user.email}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ======================================================================================================================
#                                           Login
# ======================================================================================================================
@app.route("/signIn", methods=['POST'])
def sign_in():
    """Endpoint for user login."""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        userAuth = pb.auth()
        user = userAuth.sign_in_with_email_and_password(email, password)
        return jsonify({'token': user['idToken']}), 200
    except:
        return jsonify({'message': 'There was an error logging in'}), 400


# ======================================================================================================================
#                                      Token validation
# ======================================================================================================================
@app.route('/ping', methods=['GET'])
def ping():
    """Endpoint to check the validity of a user token."""
    idToken = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(idToken)
        return jsonify({'message': 'Valid token', 'uid': decodedToken['uid']}), 200
    except Exception as e:
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401


# ======================================================================================================================
#                                            Logout
# ======================================================================================================================
@app.route('/logOut', methods=['POST'])
def log_out():
    """Endpoint for logging out (mainly token validation)."""
    token = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(token)
        return jsonify({'message': f'User {decodedToken["uid"]} has been successfully signed out.'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to sign out', 'details': str(e)}), 401


# ======================================================================================================================
#                                        Get user info
# ======================================================================================================================
@app.route('/getUserInfo', methods=['POST'])
def get_user_info():
    token = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(token)
        uid = decodedToken['uid']

        # Retrieve user information from Firestore
        userRef = db.collection('users').document(uid)
        doc = userRef.get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve user information', 'details': str(e)}), 401


# ======================================================================================================================
#                                      Update user info
# ======================================================================================================================
@app.route('/updateUserInfo', methods=['POST'])
def update_user_info():
    idToken = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(idToken)
        uid = decodedToken['uid']
    except ValueError as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401
    try:
        userInfo = {}
        if 'firstName' in request.form:
            userInfo['firstName'] = request.form['firstName']
        if 'lastName' in request.form:
            userInfo['lastName'] = request.form['lastName']
        if 'mobileNumber' in request.form:
            userInfo['mobileNumber'] = request.form['mobileNumber']

        # Check if there is a file in the request
        if 'image' in request.files:
            file = request.files['image']
            if file.filename != '':
                fileName = secure_filename(file.filename)
                blob = bucket.blob(f'userProfiles/{uid}/{fileName}')
                blob.upload_from_file(file.stream, content_type=file.content_type)
                imageUrl = blob.public_url
                userInfo['profilePicture'] = imageUrl

        # Update Firestore document for the user
        userDoc = db.collection('users').document(uid)
        userDoc.update(userInfo)

        return jsonify({'message': 'User information updated successfully', 'userInfo': userInfo}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update user information', 'details': str(e)}), 401


# ======================================================================================================================
#                                         Reset password
# ======================================================================================================================
@app.route('/forgotPassword', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    try:
        # Generate a password reset link
        link = auth.generate_password_reset_link(email)

        # For demonstration purposes, we're just returning the link
        return jsonify({'message': 'Password reset email sent successfully', 'link': link}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to generate password reset link', 'details': str(e)}), 500


# ======================================================================================================================
#                                       Report a road fault
# ======================================================================================================================
@app.route('/reportFault', methods=['POST'])
def report_fault():
    # Verify Firebase Auth ID token
    idToken = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(idToken)
        uid = decodedToken['uid']
    except Exception as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        fileName = secure_filename(file.filename)
        blob = bucket.blob(f'uploads/{uid}/{fileName}')
        blob.upload_from_string(file.read(), content_type=file.content_type)

        # Get additional data
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        description = request.form.get('description')
        imageUrl = blob.public_url

        # Save metadata to Firestore under user-specific document
        doc_ref = db.collection('userUploads').document(uid).collection('uploads').document()
        doc_ref.set({
            'fileName': fileName,
            'latitude': latitude,
            'longitude': longitude,
            'description': description,
            'uploadedAt': firestore.SERVER_TIMESTAMP,
            'imagUrl': imageUrl

        })

        return jsonify({'message': 'File uploaded successfully', 'fileName': fileName, 'latitude': latitude,
                        'longitude': longitude, 'description': description, 'imagUrl': imageUrl}), 200


# ======================================================================================================================
#                                       Get log (history)
# ======================================================================================================================
@app.route('/getLog', methods=['GET'])
def get_log():
    """Retrieve all logs (history) for the authenticated user."""
    idToken = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decodedToken = auth.verify_id_token(idToken)
        uid = decodedToken['uid']
    except ValueError as e:
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401

    try:
        uploads = db.collection('userUploads').document(uid).collection('uploads').get()
        uploadsData = [upload.to_dict() for upload in uploads]
        return uploadsData
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve logs due to: {str(e)}'}), 500


# ======================================================================================================================
#                                       Test Api
# ======================================================================================================================
@app.route('/test', methods=['GET'])
def test():
    return jsonify({'Test Api': 'Hallo World'})


# ======================================================================================================================
# ---------------------------------------( main )-----------------------------------------------------------------------
# ======================================================================================================================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
