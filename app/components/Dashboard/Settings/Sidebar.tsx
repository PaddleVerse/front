import React from 'react';

const Sidebar = ({current, setCurrent} : any) => {
  return (
    <div className="w-64 h-[100%]  text-white flex flex-col justify-start p-4 border-r-[0.5px] border-white">
      <nav>
        <ul className="space-y-4 font-sans flex flex-col items-center mt-4">
          <li>
              <button 
                onClick={() => setCurrent('My profile')}
                className={`hover:bg-[#5b565453] px-10 py-2 rounded-3xl transition duration-200 ${current === 'My profile' ? 'bg-[#5b565453]' : ''}`}
              >
                My profile
              </button>
          </li>
          <li>
              <button 
                onClick={() => setCurrent('Security')}
                className={`hover:bg-[#5b565453] px-10 py-2 rounded-3xl transition duration-200 ${current === 'Security' ? 'bg-[#5b565453]' : ''}`}
              >
                Security
              </button>
          </li>
          <li>
              <button 
                onClick={() => setCurrent('Preferences')}
                className={`hover:bg-[#5b565453] px-10 py-2 rounded-3xl transition duration-200 ${current === 'Preferences' ? 'bg-[#5b565453]' : ''}`}
              >
                Preferences
              </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
