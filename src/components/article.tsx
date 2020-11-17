import * as React from 'react';
import { Section } from '../app-types';

interface ArticlePropsInterface {
    sections: Array<Section>;
    header: string;
}
interface ArticleStateInterface {

}

export default class Article extends React.Component<ArticlePropsInterface, ArticleStateInterface>{

}