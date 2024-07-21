# Peer to Peer File Sharing Application using Pear by Holepunch

## Useful Links

- Google Drive - https://drive.google.com/file/d/1gQvmum_NPohkL022xZszyU0EbCze9JYV/view?usp=sharing
- Github - https://github.com/shaaaaz/File-Sharing-App-using-Pear

I have created a Peer to Peer file sharing application where users can connect and share files to each other reliably.

I have used ReactJS and Pear by Holepunch to create this application.

In order to download the application follow the necessary steps:

1. Installing Pear on your device:

This command will install Pear on your device

```bash
npm i -g pear
```

2. Setup pear runtime environment

Running this command twice will install Pear Runtime Environment on your device and you can now run pear application on your device.

A window asking you for the permission to continue automatic setup completion will open and click on the button to continue.

```bash
pear run pear://runtime
```

3. Installing dependencies

After extracting the files, go to zip folder and install all of the necesarry dependencies.

```bash
cd zip
npm i
npm i hyperswarm hypercore-crypto b4a
```

4. Run the app

You have successfully installed all of the dependencies and your app is good to go. To run two different instances of the app, open the first terminal and type the command

```bash
pear dev -s /tmp/inst_1
```

Open second terminal and type the command

```bash
pear dev -s /tmp/inst_2
```

To open the app in developer mode type the command

```bash
pear run --dev .
```


5. Using the App

The landing page of the application consists of two buttons- 

- Create a Room - Create a new room of yours to share files
- Join a Room - Enter the key and join an already existing room. While joining a room you might need to enter the key twice. 

After you are a part of a room you can share files in a simple manner after jus clicking on the file upload button available at the bottom of the app.

You can also invite other to your room by sharing the topic which is mentioned at the top of the screen.

