import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_DAILY_ROUTINES_WORDS } from '../../data/words/daily-routines';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('daily-routines');

export default function VocabularyDailyRoutinesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_DAILY_ROUTINES_WORDS} />;
}
