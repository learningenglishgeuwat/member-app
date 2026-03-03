import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_DRINKS_WORDS } from '../../data/words/drinks';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('drinks');

export default function VocabularyDrinksPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_DRINKS_WORDS} />;
}

