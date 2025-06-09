// главная страница с карточками
import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom'; 

const movieData = [
 {
    id: '1',
    title: 'Тёмный рыцарь',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    description: '«Тёмный рыцарь» — это философская драма о борьбе с хаосом и злом в большом городе Готэм. Брюс Уэйн, ставший Бэтменом, пытается защитить город от преступности и коррупции, но сталкивается с самым опасным противником — Джокером, воплощением анархии и безумия. Джокер ставит под сомнение все устои общества и заставляет героев принимать мучительные решения, балансируя между добром и злом. Фильм исследует темы справедливости, морали, ответственности и жертвенности, показывая, как сложно оставаться человеком в мире, где границы добра и зла размыты.',
    genre: 'Боевик, Криминал',
    duration: '2 ч 32 мин',
  },
  {
    id: '2',
    title: 'Начало',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    description: '«Начало» — сложный, многослойный триллер, в котором главный герой Дом Кобб — мастер проникновения в чужие сны для кражи секретов — получает задание не украсть, а внедрить идею в сознание другого человека. Фильм исследует природу реальности, памяти и подсознания, показывая, как идеи могут влиять на наше мышление и жизнь. Каждый уровень сна — это новая реальность с собственными правилами, где время течёт по-разному, а риск потеряться навсегда становится всё выше. «Начало» — это история о вине, искуплении и силе любви, которая может преодолеть любые границы сознания.',
    genre: 'Фантастика, Триллер',
    duration: '2 ч 28 мин',
  },
  {
    id: '3',
    title: 'Король Лев',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/fa2c8a22-35b4-4a5d-a5ad-7bfbe6420cb8/576x',
    trailerUrl: 'https://www.youtube.com/embed/7TavVZMewpY',
    description: '«Король Лев» — трогательная и мудрая история взросления молодого льва Симбы, который должен принять свою судьбу и стать королём саванны. Фильм рассказывает о круге жизни, ответственности, дружбе и преодолении страхов. Симба теряет отца и бежит, но под влиянием друзей и внутреннего голоса возвращается, чтобы сразиться за своё место в мире и восстановить справедливость. Эта история наполнена яркими персонажами, музыкальными номерами и глубокими философскими посланиями о семье и предназначении.',
    genre: 'Анимация, Приключения',
    duration: '1 ч 28 мин',
  },
  {
    id: '4',
    title: 'Властелин колец: Братство кольца',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    trailerUrl: 'https://www.youtube.com/embed/V75dMMIW2B4',
    description: 'Эпическая фэнтезийная сага «Властелин колец: Братство кольца» рассказывает о путешествии хоббита Фродо Бэггинса, которому доверено уничтожить могущественное Кольцо Всевластия, способное поработить весь мир. Фродо и его друзья — представители разных рас и народов — отправляются в опасное и полное испытаний путешествие через земли Средиземья. Фильм исследует темы дружбы, мужества, жертвы и борьбы со злом, показывая, как даже самые маленькие могут изменить ход истории, если в их сердцах живёт вера и отвага.',
    genre: 'Фэнтези, Приключения',
    duration: '2 ч 58 мин',
  },
  {
    id: '5',
    title: 'Шрек',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ef98d170-1128-4057-895a-f3cbaf2cf775/576x',
    trailerUrl: 'https://www.youtube.com/embed/CwXOrWvPBPk',
    description: '«Шрек» — весёлая и трогательная история об огре, который, несмотря на свою грозную внешность, оказывается добрым и отзывчивым. Он отправляется спасать принцессу Фиону, но на этом пути встречает много неожиданных приключений и узнаёт, что настоящее счастье — это быть собой. Фильм сочетает юмор, сказочную атмосферу и уроки о принятии и дружбе, ломая стереотипы о внешности и роли героя в сказках.',
    genre: 'Анимация, Комедия',
    duration: '1 ч 30 мин',
  },
  {
    id: '6',
    title: 'Матрица',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    trailerUrl: 'https://www.youtube.com/embed/vKQi3bBA1y8',
    description: 'Нео открывает правду о виртуальной реальности.',
    genre: 'Фантастика, Экшен',
    duration: '2 ч 16 мин',
  },
   {
    id: '7',
    title: 'Холодное сердце',
    posterUrl: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/e0071357-ce3c-441c-9d22-34e32fd17ea8/576x',
    trailerUrl: 'https://www.youtube.com/embed/L0MK7qz13bU',
    description: 'Принцесса Эльза обладает ледяной магией и хочет спасти своё королевство.',
    genre: 'Анимация, Семейный',
    duration: '1 ч 42 мин',
  },
  {
    id: '8',
    title: 'Интерстеллар',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    description: '«Интерстеллар» — эпическая научно-фантастическая драма о человечестве, стоящем на грани вымирания из-за разрушения природы и нехватки ресурсов. Группа учёных и астронавтов отправляется в космическое путешествие через червоточину в поисках нового дома для людей. Фильм исследует темы времени, пространства, жертвенности и родительской любви, показывая, как наука и человеческий дух могут спасти цивилизацию. Его визуальные эффекты и научная точность создают ощущение подлинного космического эпоса.',
    genre: 'Фантастика, Драма',
    duration: '2 ч 49 мин',
  },
  {
    id: '9',
    title: 'В поисках Немо',
    posterUrl: 'https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
    trailerUrl: 'https://www.youtube.com/embed/wZdpNglLbt8',
    description: '«В поисках Немо» — трогательная история о маленькой рыбке-клоуне Марлине, который отправляется в опасное путешествие по океану, чтобы найти своего потерянного сына Немо. По пути он встречает много ярких персонажей и учится преодолевать страхи и доверять другим. Фильм наполнен юмором, приключениями и важными уроками о семье, дружбе и вере в себя. Он показывает красоту и опасности подводного мира и ценность родительской любви.',
    genre: 'Анимация, Приключения',
    duration: '1 ч 40 мин',
  },
  {
    id: '10',
    title: 'Джокер',
    posterUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    trailerUrl: 'https://www.youtube.com/embed/zAGVQLHvwOY',
    description: '«Джокер» — мрачная психологическая драма, рассказывающая историю становления одного из самых известных злодеев комиксов. Артур Флек — человек, отверженный обществом, с тяжелой психикой, живущий в нищете и пренебрежении. Фильм показывает его постепенное превращение из забытого и непонятого человека в символ хаоса и безумия. Темы социальной несправедливости, одиночества, насилия и ментальных заболеваний раскрываются с бескомпромиссной честностью, заставляя задуматься о природе зла и гранях человеческой души.',
    genre: 'Драма, Криминал',
    duration: '2 ч 2 мин',
  },
  {
    id: '11',
    title: 'Зверополис',
    posterUrl: 'https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg',
    trailerUrl: 'https://www.youtube.com/embed/jWM0ct-OLsM',
    description: '«Зверополис» — красочный анимационный фильм, действие которого происходит в мире разумных животных, живущих в большом мегаполисе. Главная героиня — крольчиха Джуди Хоппс, ставшая первой крольчихой-полицейским, и хитрый лис Ник Уайлд, вместе расследуют загадочное дело о пропавших животных. Фильм остроумно поднимает вопросы предрассудков, стереотипов и толерантности, преподнося их в лёгкой и доступной форме для всех возрастов, сопровождая юмором и интересными приключениями.',
    genre: 'Анимация, Комедия',
    duration: '1 ч 48 мин',
  },
  {
    id: '12',
    title: 'Тайна Коко',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Ga6RYejo6Hk',
    description: '«Тайна Коко» — душевная история о мальчике Мигеле, мечтающем стать музыкантом, несмотря на запрет семьи. В поисках ответов он попадает в волшебный мир мёртвых, где узнаёт о своих корнях и семейных тайнах. Фильм ярко и эмоционально раскрывает темы памяти, традиций и силы семьи, показывая, как важно помнить и уважать предков. Он наполнен красивой музыкой, красочными образами и глубокой человечностью.',
    genre: 'Анимация, Приключения',
    duration: '1 ч 45 мин',
  },
  {
    id: '13',
    title: 'Бегущий по лезвию 2049',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aMpyrCizvSdc0UIMblJ1srVgAEF.jpg',
    trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4',
    description: '«Бегущий по лезвию 2049» — научно-фантастический триллер, действие которого происходит в будущем, где границы между людьми и репликантами размыты. Кэй, офицер по охоте на беглых репликантов, начинает расследование, которое приводит его к шокирующим открытиям о себе и будущем человечества. Фильм поднимает вопросы идентичности, сознания и морали, создавая атмосферу мрачного и футуристического мира с философским подтекстом.',
    genre: 'Фантастика, Драма',
    duration: '2 ч 44 мин',
  },
  {
    id: '14',
    title: 'Побег из Шоушенка',
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    trailerUrl: 'https://www.youtube.com/embed/6hB3S9bIaco',
    description: '«Побег из Шоушенка» — мощная драма о надежде и свободе, рассказывающая историю Энди Дюфрейна, несправедливо осуждённого на пожизненное заключение. Несмотря на тюрьму, он сохраняет внутреннюю силу и мечту о свободе, используя ум и терпение, чтобы построить новый смысл жизни и помочь другим. Фильм — о вере в себя, дружбе и способности человеческого духа преодолевать самые тяжёлые испытания.',
    genre: 'Драма, Криминал',
    duration: '2 ч 22 мин',
  },
{
  id: '15',
  title: 'Как приручить дракона',
  posterUrl: 'https://image.tmdb.org/t/p/w500/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg',
  trailerUrl: 'https://www.youtube.com/embed/Q2snuQZUQfo',
  description: '«Как приручить дракона» — увлекательная анимационная история о молодом викинге Иккинге, который вместо того, чтобы бороться с драконами, учится с ними дружить. Вместе со своим драконом Беззубиком он меняет представления своего племени и спасает их от угрозы. Фильм рассказывает о дружбе, взаимопонимании и принятии различий, наполнен юмором, приключениями и тёплыми моментами.',
  genre: 'Анимация, Приключения',
  duration: '1 ч 38 мин',
},
];



const HomePage = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const homeRef = useRef(null);
  const searchRef = useRef(null);
  const contactsRef = useRef(null);

  const onNavClick = (sectionId) => {
    switch (sectionId) {
      case 'home':
        homeRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'search':
        setSearchVisible(!searchVisible);
        searchRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contacts':
        contactsRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = movieData.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

   return (
    <>
      <Header onNavClick={onNavClick} />
      
     <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white flex flex-col items-center p-8">
  <div className="w-full flex justify-end">
    <div className="relative w-64">
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-gray-900"
        placeholder="Поиск по названию фильма..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {searchQuery.trim() !== '' &&
        movieData.length > 0 &&
        !movieData.some(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) && (
          <p className="absolute left-0 top-full mt-1 w-full text-sm text-red-100 bg-pink-700 bg-opacity-80 rounded-md px-2 py-1 shadow-md transition-all duration-300 ease-in-out animate-fade-in">
  Такого фильма нет
</p>
      )}
    </div>


</div>
        <h1 className="text-5xl font-extrabold mb-6" ref={homeRef}>
          Добро пожаловать в кинотеатр!
        </h1>
        <p className="text-lg mb-6">
          Выберите фильм и посмотрите трейлер прямо сейчас.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} to={`/booking/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>

    
        <div ref={contactsRef} className="mt-6 w-full max-w-3xl bg-white text-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-3">📞 Контакты</h2>
          <p>
            Адрес: ул. Киношная, 1<br />
            Телефон: +7 (123) 456-78-90<br />
            Email: info@cinema.com
          </p>
        </div>

        <div className="mt-6 w-full max-w-3xl bg-white text-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-3">📚 Источники информации</h2>
          <ul className="list-disc pl-6">
            <li><a href="https://www.kinopoisk.ru/" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Kinopoisk</a></li>
            <li><a href="https://www.themoviedb.org/" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">TMDB</a></li>
            <li>Собственные данные проекта</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;