import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_VEGETABLES_WORDS } from '../../data/words/vegetables';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('vegetables');

export default function VocabularyVegetablesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_VEGETABLES_WORDS} />;
}

