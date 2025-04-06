import {  useState } from 'react';
import { FaUsers, FaCogs, FaCalendarAlt, FaChartPie, FaUpload, FaUser  } from 'react-icons/fa';
import { RiUserFollowFill, RiFilePaperFill  } from "react-icons/ri";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaChalkboardUser } from "react-icons/fa6";
import { Outlet, Link,  useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Avancement par groupes");
  const navigate=useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const menuItems = [
    { name: "Etat d'avancement par Groupe", icon: FaUsers, link: '/AvencementParGroup' },
    { name: "Etat d'affectation des modules", icon: FaChalkboardUser, link: '/AffectationController' },
    { name: "Etat d'avancement par Modules", icon: FaCogs, link: '/AvencementParModule' },
    { name: "État d'avancement du 1ᵉʳ semestre", icon: FaCalendarAlt, link: '/avancementSone' },
    { name: "Nombre EFM par Groupes ", icon: RiFilePaperFill, link: '/NombreEfmParGroup' },
    { name: "Rendement des Formateurs", icon: FaChartPie, link: '/FormateursRendementController' },
    { name: "Etat d'avancement par Formateurs", icon: RiUserFollowFill, link: '/avancementFormateur' },
  ];

  const handleClick=()=>{
    localStorage.removeItem('login');
    navigate('/')
  }

  return (
    <div className="relative h-screen">

      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out shadow-lg bg-white overflow-hidden ${ isOpen ? "w-64" : "w-14"}`}>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          {isOpen && <h3 className="font-semibold text-gray-800 text-sm">Avancement Programme</h3>}
          <button onClick={toggleSidebar} className={`p-1 rounded-lg hover:bg-gray-200 transition-all duration-200 ${!isOpen && "mx-auto"}`}>
            {isOpen ? <HiChevronLeft className="h-5 w-5" /> : <HiChevronRight className="h-5 w-5" />}
          </button>
        </div>

        <div className="h-full py-2">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 py-2 ${isOpen ? "px-3" : "px-0 justify-center"} ${ activeItem === item.name ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-200"}`}
              >
                <item.icon className={`${isOpen ? "mr-3" : "mx-auto"} h-4 w-4`} title={`${isOpen ? '':item.name}`}/>
                {isOpen && <span className="text-xs">{item.name}</span>}
              </Link>
            ))}
          </div>

          <hr className='my-4 ' />

          <div className="space-y-1 px-2">
            <Link to="/importData" onClick={() => setActiveItem("Importer un fichier")} className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 py-2 ${isOpen ? "px-3" : "px-0 justify-center"} ${activeItem === 'Importer un fichier' ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-200"}`}>
              <FaUpload  className={`${isOpen ? "mr-3" : "mx-auto"} h-4 w-4`} title={`${isOpen ? '':'Importer un fichier'}`}/>
              {isOpen && <span className="text-xs">Importer un fichier</span>}
            </Link>
            {localStorage.getItem('login') &&
              <button className='flex items-center cursor-pointer rounded-lg transition-all duration-200 py-2 px-3' onClick={handleClick}>
                <FaUser size={20}  className={`${isOpen ? "mr-3" : "mx-auto"} h-4 w-4`} />
                  {isOpen && <span className='text-xs' >Déconnexion</span>}
              </button>
            }
          </div>
        </div>
      </div>


      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} mr-6`}>

        <Outlet/>

      </div>

    </div>
  );
}
