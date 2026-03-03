import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_ELECTRONICS_WORDS } from '../../data/words/electronics';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('electronics');

export default function VocabularyElectronicsPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_ELECTRONICS_WORDS} />;
}
