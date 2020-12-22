FROM cypress/base:12.18.3

#Install AWSCLI through pip
RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        groff \
        less \
        net-tools \
        lsof \
        psmisc \
        openjdk-11-jdk \
    && pip3 install --upgrade pip \
    && apt-get clean
RUN pip3 --no-cache-dir install --upgrade awscli

#Install Google Chrome for Node's webpack-dev-server
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

CMD ["/bin/bash"]
