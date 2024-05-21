# aihomeNodeProject
This repository hosts the code for my autonomous intelligent home project, primarily focusing on the main node. It was developed to demonstrate the capabilities of GitHub Actions for CI/CD. The code is designed to control a smart home environment effectively and was initially built for a Raspberry Pi 4 using Docker Desktop.



### Here are the instructions, including the steps to install Node.js, npm, and PM2 on your Raspberry Pi 4 before setting up your project.

#### Step 1: Install Node.js and npm

Open the terminal on your Raspberry Pi and update your package list:

```bash
sudo apt update
sudo apt upgrade -y
```

To facilitate the installation of a specific version of Node.js, it's advisable to first install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Now, reboot to ensure that the changes are executed:

```bash
sudo systemctl reboot
```

After restarting the system, you can proceed to install the latest stable version of Node.js (check the correct version number):

```bash
nvm install 21
```

This will install both Node.js and npm.

#### Step 2: Install PM2

With Node.js and npm installed, you can now install PM2, which will help manage your application processes:

```bash
sudo npm install pm2@latest -g
```

#### Step 3: Clone the Repository from GitHub

Navigate to the directory where you want to store your project (default is /home/USER/) and clone your repository:

```bash
mkdir myproject
cd myproject
git clone https://github.com/DariuszPiskorowski/aihomeNodeProject.git
cd your-project
```

#### Step 4: Install Dependencies

Navigate to each directory and install the required npm packages:

```bash
# For web-server
cd web-server
npm install
cd ..

# For mqtt_influx_bridge
cd mqtt_influx_bridge
npm install
cd ..
```

#### Step 5: Configuration

Ensure your configuration files for Mosquitto and InfluxDB are correctly placed in the config directory and properly set up as per your project requirements.

#### Step 6: Start Applications with PM2

Use PM2 to manage and start your applications:

```bash
# Start the web server
pm2 start web-server/server.js --name "server"

# Start the MQTT-Influx bridge
pm2 start mqtt_influx_bridge/bridge.js --name "mqtt-bridge"
```

#### Step 7: Enable PM2 Startup on Boot

To ensure that PM2 automatically starts your applications on system reboot, set up the PM2 startup script:

```bash
pm2 startup
```

Run the command that `pm2 startup` suggests (it's specific to your operating system) to configure PM2 to automatically start on boot.

#### Step 8: Save PM2 Configuration

Save the current application state with PM2 so that it restarts automatically after a reboot:

```bash
pm2 save
```

This setup should now be complete, and your system should be ready to run. If you encounter any issues, refer to the application logs or PM2 logs for troubleshooting.

### Procedure Using Docker

To install and use Docker on your Raspberry Pi 4 and then deploy your project using Docker and a `docker-compose.yml` file, follow these instructions:

#### Step 1: Install Docker on Raspberry Pi 4

Open a terminal session on your Raspberry Pi 4. First, update your package list and install required packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

Next, install Docker by downloading and running the installation script:

```bash
curl -

fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

After installation, give the `pi` user the ability to run Docker commands without needing `sudo`:

```bash
sudo usermod -aG docker pi
```

You will need to log out and back in for this to take effect, or you can type `newgrp docker` to activate it in the current session.

#### Step 2: Install Docker Compose

Though you already have a `docker-compose.yml` file, you need Docker Compose installed to use it:

```bash
sudo apt install -y libffi-dev libssl-dev
sudo apt install -y python3 python3-pip
sudo apt install -y python3-dev
sudo pip3 install docker-compose
```

#### Step 3: Clone the Repository

Clone the GitHub repository to get your project files including the `docker-compose.yml`:

```bash
cd ~
git clone https://github.com/DariuszPiskorowski/aihomeNodeProject.git
cd aihomeNodeProject
```

#### Step 4: Run Docker Compose

Now that you have your project files, navigate to the directory containing your `docker-compose.yml` file and start your Docker containers:

```bash
docker-compose up -d
```

This command will download the necessary Docker images, build your containers if required, and start them in detached mode.

#### Step 5: Verify the Containers are Running

Check that your Docker containers are running correctly:

```bash
docker ps
```

This will list the currently running containers. You should see the containers related to your project running.

By following these steps, you should be able to set up your project on a Raspberry Pi 4 using Docker and Docker Compose without any issues.