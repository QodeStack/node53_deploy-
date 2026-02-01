FROM node:22.20.0-alpine AS build

WORKDIR /app


# tạo node_modules ----
# khi cài thêm thư viện 
COPY package*.json ./
RUN npm instal 
#--------------------

# khi chỉnh sửa code 

COPY . .

# lệnh chạy trong lúc đang build 
RUN npm run build

#Xóa các thư viện trong devDependencies
RUN npm prune --production


FROM node:22.20.0-alpine AS final

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# CMD lệnh sẽ chạy sau khi build xong 
# node dist/main
CMD ["node","dist/src/main.js"]
