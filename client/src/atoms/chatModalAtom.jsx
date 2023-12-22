import {atom} from 'recoil'


const initialChatModalState = {
  isOpen: false, //  true || false
}

export const chatModalState = atom({
  key: 'chatModalState',
  default: initialChatModalState
})