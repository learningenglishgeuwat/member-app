import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_PLACES_WORDS } from '../../data/words/places';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('places');

export default function VocabularyPlacesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_PLACES_WORDS} />;
}

