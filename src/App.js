import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import Pusher from "pusher-js";
import axios from "./components/axios"; 

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("3f21b4355ecbe9949612", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessages) => {
      setMessages([...messages, newMessages])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages]);


  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
