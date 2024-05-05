FROM node:18.17.1

WORKDIR /app

# ARG host:"localhost"
#  ARG port:5433
# ARG user:"postgres"
#  ARG   password:"keko"
#    ARG  database:"postgres"


#  COPY ["package-lock.json*","package.json", "./"] 
COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]

