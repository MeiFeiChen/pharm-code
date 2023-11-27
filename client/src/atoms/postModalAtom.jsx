import {atom} from 'recoil'


export const initialPostModalState = {
  isOpen: false, //  true || false
}

export const postModalState = atom({
  key: 'postModalState',
  default: initialPostModalState
})
