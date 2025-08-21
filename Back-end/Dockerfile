FROM python:3.8

# Working directory in the container and copy it into the container at /usr/src/app
WORKDIR /usr/src/app
COPY . .

# Install needed packages in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available
EXPOSE 5000

# Define environment variable anf Run APIs.py when
ENV NAME World
CMD ["python", "./APIs.py"]
