import { useRouter } from 'next/router'
import { PAYMENT } from '../routes'

export default () => {
  const router = useRouter()
  router.replace(PAYMENT)
  return <></>
}
