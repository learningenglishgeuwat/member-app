import SpeakingGoalDetailPage from '../../components/SpeakingGoalDetailPage';
import { CEFR_A1_DETAILS_MAP } from '../../data/details/cefr-a1';

const GOAL_ID = 'cefr-a1-1-g04';

export default function Page() {
  return <SpeakingGoalDetailPage goalId={GOAL_ID} detail={CEFR_A1_DETAILS_MAP[GOAL_ID]} />;
}
