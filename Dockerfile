FROM unocha/nodejs-builder:8.9.4 as BUILDER

WORKDIR /src

COPY . .

RUN yarn && \
    yarn build


FROM unocha/nginx:1.12.2

COPY  --from=builder /src/nginx /etc/nginx/conf.d
COPY  --from=builder /src/build /srv/www/html
