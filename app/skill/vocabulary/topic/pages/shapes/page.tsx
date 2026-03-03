import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SHAPES_WORDS } from '../../data/words/shapes';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('shapes');

export default function VocabularyShapesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SHAPES_WORDS} />;
}
