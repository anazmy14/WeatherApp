import {useState} from 'react'
import {AiFillCaretDown} from 'react-icons/ai'
import {AiFillCaretRight} from 'react-icons/ai'

export default function Collapse({title, children}) {
    const [show, setShow] = useState(true);

    const handleClick = () => {
        setShow(!show);
    }

  return (
    <div>
        <div className="collapse-header" onClick={handleClick} >
             {title} 
             {show ? <AiFillCaretDown className="collapse-header__icon" /> 
             : <AiFillCaretRight  className="collapse-header__icon" /> }
        </div>
        <div className="collapse-header__content">
        {show && children}      
        </div>
    </div>
  )
}
