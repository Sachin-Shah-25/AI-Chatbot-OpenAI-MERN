function Loading({dir}){
    return <>
    <div className="loader" style={{ display: "flex", justifyContent: dir }}>
        <div className="anim_1 anim"></div>
        <div className="anim_2 anim"></div>
        <div className="anim_3 anim"></div>
    </div>
    </>
}
export default Loading