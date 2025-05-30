import Time from "./Time";
const Home = () => {
  return (
    <div className="right_side">
      <div className="home_thing">
        <div className="sas">
          <h1>Образовательный портал</h1>
          <h2>Домашняя страница</h2>
        </div>
        <Time/>
      </div>
      <div className="home">
        <div className="block">
          <h4>Индивидуальное расписание</h4>
          <p>Узнать ваше расписание в простой форме</p>
          <img src="screen1.jpg"/>
        </div>
        <div className="block">
          <h4>Данные пользователя</h4>
          <p>Узнать ваши данные в подробнастях</p>
          <img src="screen2.jpg"/>
        </div>
        <div className="block">
          <h4>Новости</h4>
          <p>Ознокомиться с новостями портала</p>
          <img src="screen3.jpg"/>
        </div>
      </div>
    </div>
  );
};

export default Home;