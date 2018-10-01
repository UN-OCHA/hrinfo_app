FROM unocha/nodejs-builder:8.11.3 as BUILDER

WORKDIR /src

COPY . .

RUN yarn && \
    yarn build


FROM unocha/nginx:1.14

COPY  --from=builder /src/nginx /etc/nginx/conf.d
COPY  --from=builder /src/build /srv/www/html
