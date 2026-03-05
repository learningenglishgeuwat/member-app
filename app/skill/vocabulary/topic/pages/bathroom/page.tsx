import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_BATHROOM_WORDS } from '../../data/words/bathroom';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('bathroom');

export default function VocabularyBathroomPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_BATHROOM_WORDS} />;
}
