import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_TRANSPORT_WORDS } from '../../data/words/transport';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('transport');

export default function VocabularyTransportPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_TRANSPORT_WORDS} />;
}

