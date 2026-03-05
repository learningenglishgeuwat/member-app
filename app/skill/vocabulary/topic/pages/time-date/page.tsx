import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_TIME_DATE_WORDS } from '../../data/words/time-date';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('time-date');

export default function VocabularyTimeDatePage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_TIME_DATE_WORDS} />;
}
