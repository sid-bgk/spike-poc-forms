<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# avoid numbers like 10MB, zero re-renders, time and size. also avoid emojis

Perfect! Here's the clean comparison table without specific numbers, emojis, or time references:

## Form Library Evaluation - DEV-635 Core Requirements

| Feature/Capability       | TanStack Form                                 | React Hook Form                        | Formik                             | Formily                          | React JSONSchema Form               |
| :----------------------- | :-------------------------------------------- | :------------------------------------- | :--------------------------------- | :------------------------------- | :---------------------------------- |
| Performance Optimization | Selective subscriptions, minimal memory usage | Minimal re-renders, optimized patterns | Higher re-renders, memory concerns | Optimized for complex forms      | Performance issues with large forms |
| Configuration Management | Built-in configuration engine                 | Manual configuration required          | Manual form construction           | Enterprise configuration system  | Pure JSON Schema approach           |
| Dynamic Forms Support    | Advanced dynamic field handling               | Good dynamic field support             | Standard dynamic support           | Advanced dynamic capabilities    | Basic array support                 |
| Enterprise Scalability   | Designed for large-scale applications         | Medium complexity applications         | Limited enterprise features        | Enterprise-grade architecture    | Not suitable for enterprise scale   |
| Development Efficiency   | Rapid field modifications                     | Moderate development speed             | Slower development cycles          | Configuration-driven development | Development limitations             |
| Bundle \& TypeScript     | Compact bundle, extreme type safety           | Small bundle, full TypeScript support  | Medium bundle, good TypeScript     | Larger bundle, full TypeScript   | Heavy bundle, basic TypeScript      |

## Key Decision Factors

**TanStack Form** - Directly addresses DEV-635 requirements:

- Eliminates getValues dependency cascades through selective subscriptions
- Significant memory usage improvements for complex forms
- Built-in configuration engine aligns with centralized architecture

**React JSONSchema Form** - Critical limitations identified:

- Known performance degradation with complex forms
- Heavy bundle impact on optimization goals
- Limited customization for partner-specific needs

**Recommendation: TanStack Form** for DEV-635 implementation
