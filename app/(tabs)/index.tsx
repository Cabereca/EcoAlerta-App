import { Text } from '@/components/Themed';
import { Link } from 'expo-router';

export default function HomePage () {
  return (
    <Link href={'/admin/login'}>
      <Text>Go to login</Text>
    </Link>
  )
}
