import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_FOOD_WORDS } from '../../data/words/food';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('food');

export default function VocabularyFoodPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_FOOD_WORDS} />;
}

