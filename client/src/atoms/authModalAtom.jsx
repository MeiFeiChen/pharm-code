import {atom} from 'recoil'


const initialAuthModalState = {
  isOpen: false, 
  type: 'login'
}

export const authModalState = atom({
  key: 'authModalState',
  default: initialAuthModalState
})
