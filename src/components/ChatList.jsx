import React from 'react'

const ChatList = () => {
  return (
    <div className='max-w-5xl mx-auto space-y-4'>
      {
        data?.map((chat) => {
            <div 
            key={chat.id}
            className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
            >
                
            </div>
        })
      }
    </div>
  )
}

export default ChatList
