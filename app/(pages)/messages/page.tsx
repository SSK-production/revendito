
import React from 'react';
import MessageForm from '@/app/components/Messages/MessageForm';



const MessagesPage: React.FC = () => {
    return (
        <div>
            <h1>Messages</h1>

            <MessageForm/>
        </div>
    );
};

export default MessagesPage;