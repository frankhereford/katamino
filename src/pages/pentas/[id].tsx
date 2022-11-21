import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import Penta from '../components/Penta'

interface PentaProps {
  id: string
}

export default function PentaComponent (props: PentaProps) {
  // access to the router to get the ID out of the URL
  const { query, isReady: routerReady } = useRouter()

  // query the penta in question and grab a function to trigger a refetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: penta, refetch: pentaRefetch } = trpc.penta.get.useQuery(
    { id: String(query.id) },
    { enabled: routerReady }
  )

  if (penta == null) { return <> </> }

  return (
    <>
      <Penta penta={penta}></Penta>
    </>
  )
}
