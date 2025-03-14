import Splash from '../assets/images/splash.png';
import { Text } from './Themed';
import { Box } from './ui/box';
import { Image } from './ui/image';

export default function SplashScreenPage() {
  return (
    <Box className='flex-1 flex items-center justify-center flex-col'>
      <Image source={Splash} alt='Splash image' className='w-80 h-96' />

      <Text className='text-sm font-thin'>Powered by Cabereca</Text>
    </Box>
  )
}
