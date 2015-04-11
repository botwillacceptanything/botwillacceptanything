FROM ubuntu:14.04
 
MAINTAINER Tomas Korcak "korczis@gmail.com"
 
ENV REFRESHED_AT 2015-01-19
 
RUN apt-get update
RUN apt-get upgrade -y
 
RUN apt-get install -y nodejs git
 
# needs this to find the nodejs exec
RUN ln -s /usr/bin/nodejs /usr/bin/node
 
RUN apt-get install -y npm


COPY . /src

RUN cd /src
RUN /usr/bin/npm install -g forever gulp bower forever
RUN /usr/bin/npm install ws


EXPOSE 80 3000 8080
 
ENTRYPOINT ["/bin/bash", "/src/start.sh"]
