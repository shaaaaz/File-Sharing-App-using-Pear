import React, { useState, useEffect, useRef } from 'react';
import Hyperswarm from 'hyperswarm'; // to create swarm and establish connection
import crypto from 'hypercore-crypto'; // to generate random bytes of data
import b4a from 'b4a'; // to handle buffer arrays

const App = () => {
  // declaring states that will be later used in the code

  const [key, setKey] = useState(''); //key that users enters in the input box
  const [peersCount, setPeersCount] = useState(0); // number of peers currently active
  const [topic, setTopic] = useState(''); // the topic or key that other peers can use to join the connection
  const [files, setFiles] = useState([]); // to handle files

  const swarm = useRef(new Hyperswarm()); // initalizes a new hyperswarm instance

  useEffect(() => {
    // stores current insance of hyperswarm
    const currentSwarm = swarm.current;
    const onPeerConnection = peer => {
      peer.on('error', err => console.log(`Error: ${err}`));
    };
    const onSwarmUpdate = () => {
      setPeersCount(currentSwarm.connections.size);
    };

    // handling connections when someone new joins in 
    currentSwarm.on('connection', onPeerConnection);
    currentSwarm.on('update', onSwarmUpdate);

    // handling when user sends a file
    const onFileSent = (peer, message) => {
      const data = JSON.parse(message); // converts json type tp object
      if (data.type === 'file') {
        const buffer = b4a.from(data.data, 'hex'); // converts the file into buffer
        setFiles(prevFiles => [...prevFiles, {
          from: b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6),
          name: data.name,
          buffer
        }]); // sores the files in files pbject with given info
      }
    };

    // calling on file sent function when user uploads a file
    currentSwarm.on('connection', peer => {
      peer.on('data', message => onFileSent(peer, message));
    });

    // removes the event listeners to prevent memory leaks
    return () => {
      currentSwarm.removeListener('connection', onPeerConnection);
      currentSwarm.removeListener('update', onSwarmUpdate);
      currentSwarm.destroy(); // destroys the swarm so that data is safe and nework is fast
    };
  }, []);

  // creates a new chat room 
  const createChatRoom = async () => {
    console.log("on create chat room");
    const topicBuffer = crypto.randomBytes(32); //creates a string of 32 random bytes
    joinSwarm(topicBuffer); // calls the join swarm function
  };

  // when user joins a chat room it grants the access to the user
  const joinChatRoom = async e => {
    e.preventDefault();
    if (topic) return;
    console.log("on join chat room");
    const topicBuffer = b4a.from(key, 'hex'); // converts the key received from the input to buffer array 
    joinSwarm(topicBuffer); // calls the join swarm function
  };

  // called from createRoom and joinRoom 
  const joinSwarm = async topicBuffer => {
    console.log("on join swarm");
    const discovery = swarm.current.join(topicBuffer, {
      client: true,
      server: true
    }); // initiates the process of joining a swarm
    await discovery.flushed(); // ensures that join op is completed 

    setTopic(b4a.toString(topicBuffer, 'hex')); // sets the topic using which others can join the swarm
  };
  const handleFileUpload = async e => {
    const file = e.target.files[0]; // retrieves the file sleected by the user
    const reader = new FileReader(); // creates a new FileReader insance

    reader.onload = async event => {
      const arrayBuffer = event.target.result; // takes the result which is an array of buffer
      const buffer = b4a.from(arrayBuffer); // converts the array buffer to binary form

      const peers = [...swarm.current.connections]; // takes all of the peers connected
      for (const peer of peers) peer.write(JSON.stringify({
        type: 'file',
        name: file.name,
        data: buffer.toString('hex')
      }));
      // ierates over the array of connecetd peers and send everyone the file 

      setFiles(prevFiles => [...prevFiles, {
        from: 'You',
        name: file.name,
        buffer
      }]); // updates the files state
    };
    reader.readAsArrayBuffer(file); // reads the file as buffer converts it and sends it to every peer
  };
  const downloadFile = async (file, index) => {
    const buffer = file.buffer; // takes the binary adta of the file stored in file.buffer
    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    }); // creates a new blob object from the buffer
    const url = URL.createObjectURL(blob); // generates a url which will sore the blob data

    //creates a new el in DOM and hanldes the download function on click which downloads the file
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "white"
  }, !topic && /*#__PURE__*/React.createElement("div", {
    className: "joinPage hw100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "create",
    onClick: () => createChatRoom()
  }, "CREATE A ROOM"), /*#__PURE__*/React.createElement("div", {
    className: "orBlock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "line"
  }), "OR", /*#__PURE__*/React.createElement("div", {
    className: "line"
  })), /*#__PURE__*/React.createElement("div", {
    className: "joinArea",
    onClick: e => joinChatRoom(e)
  }, /*#__PURE__*/React.createElement("div", {
    className: "create"
  }, "JOIN A ROOM"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "keyBox",
    placeholder: "Enter a Key",
    onChange: e => setKey(e.target.value)
  }))), topic && /*#__PURE__*/React.createElement("div", {
    className: "mainPage"
  }, /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("div", {
    className: "topArea"
  }, "Topic : ", topic), /*#__PURE__*/React.createElement("div", {
    className: "topArea"
  }, "Peer Count : ", peersCount)), /*#__PURE__*/React.createElement("div", {
    className: "filesList"
  }, files.map((file, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: `fileItem ${file.from === 'You' ? 'fromYou' : 'fromPeer'}`
  }, /*#__PURE__*/React.createElement("div", null, file.from), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    onClick: () => downloadFile(file, index),
    className: "download"
  }, "DOWNLOAD"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, file.name)))), /*#__PURE__*/React.createElement("div", {
    className: "uploadBox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "fileUpload",
    onChange: handleFileUpload,
    className: "upload"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "fileUpload",
    className: "label"
  }, "UPLOAD FILE"))));
};
export default App;