import PropTypes from 'prop-types'
import AlgorithmDescription from "./Description/AlgorithmDescription"
import DatabaseDescription from "./Description/DatabaseDescription"

ProblemDescription.propTypes = {
  problem: PropTypes.object.isRequired,
}

export default function ProblemDescription( { problem } ) {
	return (
    <>
      { !(problem?.database) && (<AlgorithmDescription problem={ problem }/>)}
      { (problem?.database) && (<DatabaseDescription problem={ problem }/>)}
    </>
    


	)
}

