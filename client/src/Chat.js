import { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if(currentMessage !== '') {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }
      await socket.emit('send_message', messageData)
      setMessageList(prevState => [...prevState, messageData])
      setCurrentMessage('')
    }
  }

  useEffect(() => {
    socket.on('receive_message', data => {
      setMessageList(prevState => [...prevState, data])
    })
  }, [socket])
  return (
    <div className='chat-window'>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
          <ScrollToBottom className='message-container'>
            {messageList.map(msg => {
              return (
                <div className="message" id={`${username === msg.author ? 'you' : 'other'}`}>
                  <div>
                    <div className="message-content">
                      <p>{msg.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{msg.time}</p>
                      <p id="author">{msg.author}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" value={currentMessage} placeholder='Hey...' onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()}/>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
