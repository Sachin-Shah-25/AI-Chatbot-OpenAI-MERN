import UserImage from '../assets/userimage.png'
function UserMessage({botrep}) {
    return <>
        <div className="user_msg_container">
            <div className="user_msg">
                {
                    botrep.includes("Confirm Details") 
                    ? botrep.split(",").map((res)=>{
                       return <h5>{res}</h5>
                    })
                    : <h5>{botrep && botrep}</h5>
                }
                
                
            </div>
            <div className="user_image">
               <img src={UserImage} />
            </div>
        </div>
    </>
}

export default UserMessage