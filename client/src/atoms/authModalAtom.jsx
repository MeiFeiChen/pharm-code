import {atom} from 'recoil'


const initialAuthModalState = {
  isOpen: false, //  true || false
  type: 'login'  // login || register || forgot password
}

export const authModalState = atom({
  key: 'authModalState',
  default: initialAuthModalState
})

