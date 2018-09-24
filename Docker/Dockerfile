FROM node:latest

# ARGS
ARG PROJECT_NAME=hrinfo_app
# get default node user : 'node'
ARG USER=node
ARG WORKSPACE=/usr/dockers/devapp

# update system
RUN apt-get update

# allow npm to install as root user
#other solution : RUN npm -g install nodegit --unsafe-perm
RUN npm -g config set user root

#install project dependencies
RUN npm install --silent
RUN npm install react-scripts --save
RUN npm install react-c3js --save
RUN npm install @material-ui/core@latest --save
RUN npm install @material-ui/icons --save
#RUN npm install c3
#RUN npm install material-ui-pickers --save
#RUN npm install moment --save
#RUN npm install moment-timezone --save
#RUN npm install draft-js --save
#RUN npm install draft-js-export-html --save
#RUN npm install i18next --save
#RUN npm install lodash --save
#RUN npm install react-big-calendar --save
#RUN npm install react-cookie --save
#RUN npm install react-dazzle --save
#RUN npm install react-dom --save
#RUN npm install react-draft-wysiwyg --save
#RUN npm install react-dropbox-chooser --save
#RUN npm install react-i18next --save
#RUN npm install react-render-html --save
#RUN npm install react-router-dom --save
#RUN npm install react-rrule-generator --save
#RUN npm install react-select --save
RUN apt-get install git
RUN npm -v

WORKDIR $WORKSPACE

# copy the check script : do what you want. see below for the call
COPY ./Docker/check-project.sh ./Docker/check-project.sh

##
# Since we are not creating any user here, you need to add the default docker's user
# to your computer by updatinf both following files:
# nano /etc/subuid
# nano /etc/subgid
# https://blog.ippon.tech/docker-and-permission-management/
#
# Exemple of content :
#  currentUser:1000:65536
#
# add node user
#  node:1000:65536
##
RUN chown -R $USER:$USER $WORKSPACE
RUN echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf
RUN cat /proc/sys/fs/inotify/max_user_watches

USER $USER

# RUN git config --global user.email "axel.reliefapps@gmail.com"
# RUN git config --global user.name "axel.reliefapps"

RUN npm -g config set user $USER
RUN ls -la
COPY ./package*.json ./
RUN bash Docker/check-project.sh $PROJECT_NAME


# EXPOSE 3630
