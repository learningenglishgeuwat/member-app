import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_FEELINGS_WORDS } from '../../data/words/feelings';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('feelings');

export default function VocabularyFeelingsPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_FEELINGS_WORDS} />;
}

