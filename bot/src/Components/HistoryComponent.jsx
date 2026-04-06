import { AppProvider } from '../ContextProvider/AppContext'
import {useContext} from 'react'
function HistoryComponent({ det }) {
    const { setHistory } = useContext(AppProvider)

  return (
   <div className="chat-bot-container">
  <div className="bot-message">
    <h4>Appointment Details</h4>

    <div className="details">
      <span>Name</span><p>{det.name}</p>
      <span>Age</span><p>{det.age}</p>
      <span>Gender</span><p>{det.gender}</p>
      <span>Department</span><p>{det.dep}</p>
      <span>Date</span><p>{det.date}</p>
      <span>Email</span><p>{det.email}</p>
      <span>App ID</span><p>{det.appid}</p>
    </div>

    <button className="cancel-btn" onClick={()=>setHistory("CANCEL")}>Cancel</button>
  </div>
</div>
  );
}

export default HistoryComponent;