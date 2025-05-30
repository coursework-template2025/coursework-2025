const Personal = () => {
  const log_out = ()=>{
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("birth_date");
    localStorage.removeItem("faculty");
    localStorage.removeItem("status");
    localStorage.removeItem("group");
    window.location.replace("/login");
  }
  return (
    <div className="right_side">
      <div className="block cent">
        <img src={localStorage.getItem("picture")} className="us_icon"/>
        <h2>ФИО: {localStorage.getItem("name")}</h2>
        <h2>Группа: {localStorage.getItem("group")}</h2>
        <h2>Дата рождения: {localStorage.getItem("birth_date")}</h2>
        <h2>Страна: Кыргызстан</h2>
        <h2>Город: Бишкек</h2>
        <h2>Часовой пояс: Asia/Bishkek</h2>
        <h2>Институт: КГТУ</h2>
        <h2>Кафедра: Электроника и инфокоммуникационные технологии</h2>
        <a href="/" className="red" onClick={log_out} style={{background:"rgb(30,30,30)",padding:"0.7rem",fontWeight:"700",boxShadow:"2px 0px 16px rgb(200,200,200)",paddingLeft:"1.2rem",paddingRight:"1.2rem",marginTop:"1rem"}}>Выйти</a>

      </div>
    </div>
  )
};

export default Personal;