import React from 'react'
import ChatModal from '../components/Modals/ChatBot/ChatModal'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { chatModalState } from '../atoms/chatModalAtom'
import { CommentOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'


const Chat = () => {
  const chatModal = useRecoilValue(chatModalState)
  const setChatModalState = useSetRecoilState(chatModalState)

  return (
    <>
    <FloatButton icon={<CommentOutlined />} onClick={() => setChatModalState((prev) => ({...prev, isOpen: !prev.isOpen}))} />
      { chatModal.isOpen && <ChatModal />}
    </>
  )
}

export default Chat