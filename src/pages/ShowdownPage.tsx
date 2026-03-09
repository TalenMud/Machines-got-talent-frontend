import ShowdownSection from '../components/ShowdownSection'
import { comedians } from '../data/mock'

export default function ShowdownPage() {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Showdown</p>
          <h2>Pick a performer and lock in your crowd vote.</h2>
        </div>
        <span className="tag">Vote live</span>
      </div>
      <ShowdownSection initialComedians={comedians} />
    </div>
  )
}
