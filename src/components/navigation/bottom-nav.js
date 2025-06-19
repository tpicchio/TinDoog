import { HiHeart, HiUser } from 'react-icons/hi';

export function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'matching', icon: HiHeart },
    { id: 'profile', icon: HiUser }
  ];

  return (
    <nav className="h-full bg-white border-t flex justify-center items-center">
		<div className='flex w-1/3 h-full'>
			{tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				
				return (
				<button
					key={tab.id}
					onClick={() => onTabChange(tab.id)}
					className={`flex-1 flex items-center justify-center h-full transition-colors ${
					isActive 
						? 'text-purple-500 bg-purple-50' 
						: 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
					}`}
				>
					<Icon className="text-2xl" />
				</button>
				);
			})}
		</div>
    </nav>
  );
}
