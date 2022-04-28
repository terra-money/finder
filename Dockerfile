# pull official base image
FROM node:16.14.2 

# set working directory 
WORKDIR /app 

# Install app dependencies 
COPY package.json ./ 
COPY package-lock.json ./
RUN npm install --quiet 

# Copy app files 
COPY . ./ 

# Start the app 
CMD ["npm", "start"]