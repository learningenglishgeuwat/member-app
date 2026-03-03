import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_TASTE_WORDS } from '../../data/words/taste';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('taste');

export default function VocabularyTastePage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_TASTE_WORDS} />;
}

