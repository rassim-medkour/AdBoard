FROM node:22

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for the container architecture
RUN npm rebuild bcrypt --update-binary

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose API port
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "run", "dev"]
